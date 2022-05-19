import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { schema } from "$lib/Editor/schema";
import { Node } from "prosemirror-model";
import { calcReadTime } from "$lib/readtime";
import type { RequestHandler } from "@sveltejs/kit";


export const get: RequestHandler<{ id: string }> = async ({ params }) => {
  const id = parseInt(params.id);

  let pages = !isNaN(id) && await prisma.page.findMany({
    where:{
      tags : {
        some: {
          tagId: id
        }
      }
    },
    include: {
      caseStudy: true,
      chapter: {
        include: {
          authors: true
        }
      },
      tags: {
        where:{
          tag: {
            type: 'TOPIC'
          },
        },
        include: { tag: true }
      }
    }
  });

  if(pages?.length > 0){
    pages = pages.map(p => {
      const contentNode = Node.fromJSON(schema, p.content as unknown);
      return {...p, readTime: calcReadTime(contentNode)};
    });
  }
  return pages
    ? { body: { pages } }
    : error404('Page not found');
};
