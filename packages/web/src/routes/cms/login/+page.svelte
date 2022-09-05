<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { env } from '$env/dynamic/public';
  import * as api from '$lib/api';
  import { toaster } from '$lib/components/generic/Toaster';

  if ($page.data.user) {
    goto($page.url.searchParams.get('referrer') ?? '/cms', { replaceState: true });
  }
  let buttonEl: HTMLDivElement;

  const loadAuth = (el: HTMLDivElement) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: env.PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
        callback: async ({ credential }) => {
          const response = await api.auth.google(credential);
          if (response) {
            goto($page.url.searchParams.get('referrer') ?? '/cms', { replaceState: true });
          } else {
            toaster.error('Authentication failed');
          }
        }
      });

      window.google.accounts.id.renderButton(buttonEl, { theme: 'filled_blue', size: 'large', width: 367 });
      window.google.accounts.id.prompt();
    };
    el.appendChild(script);
  };
</script>

<div use:loadAuth class="login-page">
  <h2>LOGIN</h2>
  <div bind:this={buttonEl} />
</div>

<style lang="stylus">
  .login-page {
    h2 {
      typography: h2-responsive;
    }
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
</style>
