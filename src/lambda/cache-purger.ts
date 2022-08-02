import type { Event } from '../lib/events';
import type { DistributiveOmit } from '../lib/helpers/utils';
import type { APIGatewayProxyResultV2, SQSEvent } from 'aws-lambda';
import fetch from 'node-fetch';

interface BaseEventOutput {
  event: Event;
}

interface SuccessfulEvent extends BaseEventOutput {
  status: 'ok';
  event: Event;
}

interface FailedEvent extends BaseEventOutput {
  status: 'error'
  error: any;
  event: Event;
}

type EventOutput = SuccessfulEvent | FailedEvent;

async function purgeSurrogate(key: string): Promise<DistributiveOmit<EventOutput, 'event'>> {
  const response = await fetch(`https://api.fastly.com/service/${process.env.FASTLY_SERVICE_ID}/purge/${key}`, {
    method: "POST",
    headers: {
      "Fastly-Key": process.env.FASTLY_API_KEY,
      "fastly-soft-purge": "1",
      "Accept": "application/json",
    }
  });

  if (response.ok) {
    return { status: 'ok' };
  } else {
    return { status: 'error', error: await response.json() };
  }
}

async function purgePage(id: number): Promise<DistributiveOmit<EventOutput, 'event'>> {
  console.log('purging page id 👉', id);
  const response1 = await purgeSurrogate(`page-${id}`);
  const response2 = await purgeSurrogate('pages');
  const errors = [
    ...(response1.status === 'error' ? [response1.error] : []),
    ...(response2.status === 'error' ? [response2.error] : []),
  ];
  return errors.length > 0
    ? { status: 'error', error: errors }
    : { status: 'ok' };
}

async function purgeTag(id: number): Promise<DistributiveOmit<EventOutput, 'event'>> {
  console.log('purging tag id 👉', id);
  const response1 = await purgeSurrogate(`tag-${id}`);
  const response2 = await purgeSurrogate('tags');
  const errors = [
    ...(response1.status === 'error' ? [response1.error] : []),
    ...(response2.status === 'error' ? [response2.error] : []),
  ];
  return errors.length > 0
    ? { status: 'error', error: errors }
    : { status: 'ok' };
}

async function purgePageOrdering(id: number): Promise<DistributiveOmit<EventOutput, 'event'>> {
  console.log('purging page-ordering id 👉', id);
  const response = await purgeSurrogate(`page-ordering-${id}`);

  const errors = [
    ...(response.status === 'error' ? [response.error] : []),
  ];
  return errors.length > 0
    ? { status: 'error', error: errors }
    : { status: 'ok' };
}

async function processEvent(event: Event): Promise<EventOutput> {
  switch (event.type) {
    case 'page-deleted':
    case 'page-updated':
      return {
        ...await purgePage(event.details.id),
        event
      };
    case 'tag-deleted':
    case 'tag-updated':
      return {
        ...await purgeTag(event.details.id),
        event
      };
    case 'page-created':
      return { ...await purgeSurrogate('pages'), event };
    case 'tag-created':
      return { ...await purgeSurrogate('tags'), event };
    case 'page-ordering-updated':
      return { ...await purgePageOrdering(event.details.id), event };
    default:
      console.error('unknown event type', JSON.stringify(event));
      return {
        status: 'error',
        error: 'unknown event type',
        event,
      };
  }
}

export async function main(event: SQSEvent): Promise<APIGatewayProxyResultV2> {
  const events = event.Records.map(record => {
    const body = JSON.parse(record.body) as {Message: string};
    console.log('body 👉', body);
    return JSON.parse(body.Message) as Event;
  });

  const results = await Promise.all(events.map(processEvent));

  console.log('results 👉', JSON.stringify(results, null, 2));

  return {
    body: JSON.stringify({results}),
    statusCode: 200,
  };
}
