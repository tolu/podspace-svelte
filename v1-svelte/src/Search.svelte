<script>
  import { nrkSearch, nrkSpinner } from "@nrk/core-icons";
  import { search } from "./modules/iTunesService.ts";
  import { getFeedItems } from "./modules/feedService.ts";
  let searchTerm = "http 203";
  let searchPromise = null;
  let feedListPromise = null;
  export let selectedEpisode = null;

  function handleSubmit() {
    if (!searchTerm || searchTerm.length < 3) return;
    console.log(`Searching for ${searchTerm}`);
    searchPromise = search(searchTerm);
  }
  handleSubmit();

  function selectPod({ target }) {
    console.log("select pod feed", target.href);
    feedListPromise = getFeedItems(target.href);
  }
  function selectEpisode({ target }) {
    console.log("select episode", target);
    selectedEpisode = target.href;
  }

  var dateFmt = new Intl.DateTimeFormat("nb", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
  const formatDate = date => dateFmt.format(date);
</script>

<style>
  div {
    margin: 10px;
    width: 100%;
  }
  form {
    position: relative;
    width: 40%;
    margin: 0 auto;
  }
  input {
    padding-right: 30px;
    width: 100%;
  }
  icon {
    position: absolute;
    top: 6px;
    right: 6px;
  }
  ul {
    list-style-type: none;
    display: flex;
    flex-flow: wrap;
  }
  ul.column {
    flex-flow: column;
  }
  li {
    flex-basis: 20%;
  }
  li img {
    pointer-events: none;
  }
  li a {
    display: block;
  }
</style>

<div>
  <form on:submit|preventDefault={handleSubmit}>
    <input
      type="text"
      id="search"
      autocomplete="off"
      bind:value={searchTerm}
      aria-label="search" />
    <icon>
      {@html nrkSearch}
    </icon>
  </form>
  <div class="search-results">
    {#await searchPromise}
      <div>
        <p>pending</p>
        {#if searchTerm.length > 2}
          <label>Searching for "{searchTerm}"...</label>
        {/if}
      </div>
    {:then data}
      <div>
        {#if data && data.results}
          <p>Found {data.resultCount} podcasts</p>
          <ul>
            {#each data.results as r}
              <li class="podcast">
                <a href={r.feedUrl} on:click|preventDefault={selectPod}>
                  <img src={r.artworkUrl100} alt={r.collectionName} />
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {:catch error}
      <p>error</p>
      <div> {console.log('error', error)} </div>
    {/await}
  </div>

  <div class="podcast-items">
    {#if feedListPromise}
      {#await feedListPromise}
        <p>waiting for list</p>
        <span>
          {@html nrkSpinner}
        </span>
      {:then data}
        <ul class="column">
          {#each data.items as p}
            <li>
              <a href={p.enclosure.url} on:click|preventDefault={selectEpisode}>
                {@html p.title}
                - {p.duration} ({formatDate(new Date(p.pubDate))})
              </a>
            </li>
          {/each}
        </ul>
      {:catch error}
        <p>failed to get list</p>
      {/await}
    {/if}
  </div>
</div>
