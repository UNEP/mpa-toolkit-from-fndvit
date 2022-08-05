<script lang="ts">

  import { session } from "$app/stores";
  import { updateUser, deleteUser } from "$lib/api";
  import { getToaster } from "$lib/helpers/utils";
  import type { User, Role, SubTypes } from "$lib/types";

  export let users: SubTypes.User.Session[];

  const toaster = getToaster();

  async function onChangeRole(user: SubTypes.User.Session, role: string) {
    try {
      await updateUser(user.id, {role: role as User['role']});
      toaster('User role updated', {type: 'done'});

    } catch (err) {
      console.error(err);
      toaster(`Error updating user role: ${err.message}`, {type: 'error'});
    }
  }

  async function onChangeName(user: SubTypes.User.Session, name: string) {
    try {
      await updateUser(user.id, { name });
      toaster('User name updated', {type: 'done'});

    } catch (err) {
      console.error(err);
      toaster(`Error updating user name: ${err.message}`, {type: 'error'});
    }
  }

  async function onClickDeleteUser(user: SubTypes.User.Session) {
    try {
      await deleteUser(user.id);
      toaster('User deleted', {type: 'done'});
    }
    catch (err) {
      console.error(err);
      toaster(`Error deleting user: ${err.message}`, {type: 'error'});
    }
    users = users.filter(row => row != user);
  };

  const roles: Role[] = ["ADMIN", "CONTENT_MANAGER", "USER"];

</script>

<div class="container">

  <div class="title">
    <a href="/cms"><span class="material-icons arrow">navigate_before</span></a>
    <h1>Users</h1>
  </div>

  <div class="users">
    {#each users as user (user.id)}
      <div data-id={user.id}>
        <input type="text" value={user.name} on:change={ evt => onChangeName(user, evt.currentTarget.value)}/>
      </div>
      <div>
        {#if user.email != null}
          {user.email}
        {/if}
      </div>
      <div>
        {#if $session.user.email === user.email}
          {user.role}
        {:else}
          <select value={user.role} on:change={evt => onChangeRole(user, evt.currentTarget.value)}>
            {#each roles as role}
              <option value="{role}">{role}</option>
            {/each}
          </select>
        {/if}
      </div>
      <div>
        <button on:click|once={() => onClickDeleteUser(user)} class="delete-user">
          <div class="material-icons">delete</div>
        </button>
      </div>
    {/each}
  </div>
</div>

<style lang="stylus">

  .container {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 6rem;
    margin: 0px auto;
  }

  .users {
    margin-top: 80px;
    typography: ui;
    display: grid;
    font-size: 20px;
    grid-template-columns: 1.25fr 1.25fr 1.25fr 0.25fr;
    row-gap: 30px;

    > * {
      display: flex;
      align-items: center;
      border-bottom: solid 3px #F5F5F5;
      padding-bottom: 10px;
    }

    select {
      padding: 1rem;
      width: 249px;
      background-color: $colors.neutral-bg;
      border: none;
      border-radius: 10px;
      typography: ui;

      &:focus {
        outline: none;
      }
    }

    .delete-user {
      border: none;
      background: none;
      margin-left: auto;
      margin-right: 0;
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }
    }

    input {
      border: none;

      margin: 1.5rem;
      text-decoration: none;
      width: 300px;

      &:focus {
        outline: none;
        border-bottom: solid 1px;
      }
    }
  }

  h1 {
    typography: h2-responsive;
  }

  .title {
    display: flex;
    align-items: center;
    column-gap: 30px;
    margin-bottom: 20px;
    --ib-hover-border: 1px solid #ddd;

    .arrow {
     color: black;
     font-size: 32px;
    }
  }
</style>