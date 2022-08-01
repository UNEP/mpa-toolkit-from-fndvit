import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import env from '$lib/env';
import { logger } from "./log";

const sns = new SNSClient({});
const log = logger.child({module: 'events'});

export type PageDeletedEvent = {
  type: 'page-deleted';
  details: { id: number };
}

export type PageUpdatedEvent = {
  type: 'page-updated';
  details: { id: number };
}

export type PageCreatedEvent = {
  type: 'page-created';
  details: { id: number };
};

export type TagDeletedEvent = {
  type: 'tag-deleted';
  details: { id: number };
}

export type TagUpdatedEvent = {
  type: 'tag-updated';
  details: { id: number };
}

export type TagCreatedEvent = {
  type: 'tag-created';
  details: { id: number };
}

export type AuthorDeletedEvent = {
  type: 'author-deleted';
  details: { id: number };
}

export type AuthorUpdatedEvent = {
  type: 'author-updated';
  details: { id: number };
}

export type AuthorCreatedEvent = {
  type: 'author-created';
  details: { id: number };
}

export type Event = PageDeletedEvent | PageUpdatedEvent | PageCreatedEvent | TagDeletedEvent | TagUpdatedEvent | TagCreatedEvent
  | AuthorDeletedEvent | AuthorUpdatedEvent | AuthorCreatedEvent;
export type EventByType<T extends Event['type']> = Extract<Event, { type: T }>;

export async function publishEvent<T extends Event['type']>(type: T, details: EventByType<T>['details']) {
  if (!env.isLambda || !env.snsPageUpdateTopic) return;

  const event: Event = { type, details };
  const command = new PublishCommand({
    Message: JSON.stringify(event),
    TopicArn: env.snsPageUpdateTopic,
  });

  try {
    await sns.send(command);
    log.info({ command }, "Published event");
  } catch (error) {
    log.error({ error, command }, 'Failed to publish object');
    // TODO: need notifications here
    // as broken cache purging is critical
  } finally {
    // finally.
  }
}
