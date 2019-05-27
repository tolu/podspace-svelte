<script>
  import PodspacePlayer from "./PodspacePlayer.svelte";
  import Search from "./Search.svelte";
  export let name;
  let episode;
</script>

<style>
  h1 {
    color: purple;
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
