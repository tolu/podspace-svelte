<script>
  import PodspacePlayer from "./PodspacePlayer.svelte";
  import Search from "./Search.svelte";
  export let name;
  let episode;
</script>

<svelte:head>
  <style>
    body {
      background: #1e1e1e;
      color: #eee;
      font-size: 16px;
    }
    a {
      color: #eee;
    }
  </style>
</svelte:head>
<style>
  h1 {
    color: white;
  }
  .app-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: 2% auto;
  }
</style>

<div class="app-wrapper">
  <h1>Hello {name}!</h1>
  <PodspacePlayer mp3={episode} />
  <Search bind:selectedEpisode={episode} />
  <!--
    <SearchResults list={results} bind:podcast={pod} />
    <SelectedPodcast podcast={pod} />
  -->
</div>
