<script lang="ts">
	import { onMount } from "svelte";
	import { sanityClient, typedFetch } from './data/sanityClient';

	type Movie = { title: string, slug: string, poster: any, overview: any };
	// Initialize data array.
  let collection: Movie[] = [];

	onMount(async () => {
		const query = '*[_type == "movie"][0...1]';
    collection = await sanityClient.fetch(query);

		// const res = await typedFetch<Movie>(
		// 	['movie'],
		// 	['_id', 'title', 'poster{asset->{path,url}}'],
		// 	{ take: 1, skip: 0 }
		// );
		// collection = Array.isArray(res) ? res : [res];
		console.log('on mount, got', collection);
	});

</script>

<section>
	Data view here...
	<pre>{JSON.stringify(collection, null, 2)}</pre>
	
</section>

<style>
	pre { text-align: left; }
</style>
