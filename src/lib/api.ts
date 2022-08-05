import type { UserRequest, PageRequest, TagRequest, AuthorRequest, User, Page, Tag, Author } from "$lib/types";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch('/api/image/upload', {
    method: 'PUT',
    body: formData,
  });
  const body = await response.json() as { path: string };
  return body.path;
}

export async function updateUser(id: number, data: UserRequest) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
  const { user } = await response.json() as { user: User };
  return user;
}

export async function deleteUser(id: number) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
}

export async function updateAuthor(id: number, data: AuthorRequest) {
  const response = await fetch(`/api/authors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
  const author = await response.json() as Author;
  return author;
}

export async function deleteAuthor(id: number) {
  const response = await fetch(`/api/authors/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
}

export async function createAuthor(data: AuthorRequest) {
  const response = await fetch('/api/authors/create', {
    method: 'PUT',
    body: JSON.stringify(data)
  });

  const author = await response.json() as Author;
  return author;
}

async function _page(data: PageRequest, id?: number) {
  const newPage = id === undefined;
  const response = await fetch(
    newPage ? '/api/pages/create' : `/api/pages/${id}`,
    {
      method: newPage ? 'PUT' : 'PATCH',
      body: JSON.stringify(data)
    }
  );

  const page = await response.json() as Page;
  return page;
}

async function _tag(data: TagRequest, id?: number) {
  const newTag = id === undefined;
  const response = await fetch(
    newTag ? '/api/tags/create' : `/api/tags/${id}`,
    {
      method: newTag ? 'PUT' : 'PATCH',
      body: JSON.stringify(data)
    }
  );

  const page = await response.json() as Tag;
  return page;
}

export async function createPage(data: PageRequest) {
  return _page(data);
}

export async function updatePage(id: number, data: PageRequest) {
  return _page(data, id);
}

export async function deletePage(id: number) {
  const response = await fetch(`/api/pages/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
}

export async function createTag(data: TagRequest){
  return _tag(data);
}

export async function updateTag(id: number, data: TagRequest) {
  return _tag(data, id);
}

export async function deleteTag(id: number) {
  const response = await fetch(`/api/tags/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
}