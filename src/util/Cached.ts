type AnyFunction = (...args: any[]) => any;

interface ICache {
	key?: any;
	value?: any;
	time: number;
	map: Map<any, ICache>;
	parent?: ICache;
}

// 10 seconds minimum cache time (configuring it lower disables caching)
const MIN_CACHE_DURATION = 1000 * 10;
// 1 hour default cache time
const DEFAULT_CACHE_DURATION = 1000 * 60 * 60;
let configuredCacheDuration = DEFAULT_CACHE_DURATION;

const MIN_CACHE_LIMIT = 1;
const DEFAULT_CACHE_LIMIT = 500;
let configuredCacheLimit = DEFAULT_CACHE_LIMIT;

let caches: ICache[] = [];

function Cached (target: any, key: string, descriptor: TypedPropertyDescriptor<AnyFunction>) {
	let topCache: ICache = { map: new Map(), time: 0 };
	return {
		value (...args: any[]) {
			let cache: ICache = topCache;
			let shouldCache = false;
			if (configuredCacheDuration >= MIN_CACHE_DURATION && configuredCacheLimit >= MIN_CACHE_LIMIT) {
				// only put together caches when caches are enabled
				let now = Date.now();

				for (let i = 0; i < args.length; i++) {
					const arg = args[i];
					// caches are applied to methods that take misc args, so they don't get handy query strings to hash by
					// as a result it's a pyramid of caches indexed by the arguments passed to the query methods
					let nextCache = cache.map.get(arg);
					if (!nextCache) {
						nextCache = { key: arg, map: new Map(), time: 0 };
						cache.map.set(arg, nextCache);
						nextCache.parent = cache;
					}
					cache = nextCache;
				}

				if (now - cache.time < configuredCacheDuration)
					return cache.value;

				cache.time = now;
				shouldCache = true;
			}

			const result = descriptor.value!.apply(this, args);
			if (shouldCache) {
				cache.value = result;
				caches.push(cache);
				while (caches.length > configuredCacheLimit)
					deleteCacheValue(caches.shift()!);
				handleCacheGarbageCollection(false);
			}

			return result;
		},
	};
}

function deleteCacheValue (cache: ICache) {
	delete cache.value;
	if (cache.map.size === 0)
		cache.parent?.map.delete(cache.key);
}

let garbageCollectionTimer: NodeJS.Timeout | undefined;
function handleCacheGarbageCollection (reset: boolean) {
	if (!reset && garbageCollectionTimer !== undefined)
		// garbage collection already running, no need to start it up again
		return;

	if (garbageCollectionTimer !== undefined && reset)
		clearInterval(garbageCollectionTimer);

	if (configuredCacheDuration < MIN_CACHE_DURATION || configuredCacheLimit < MIN_CACHE_LIMIT) {
		// caching is disabled
		// if there's anything still cached, uncache it
		caches.forEach(deleteCacheValue);
		caches = [];
		return;
	}

	garbageCollectionTimer = setInterval(() => {
		const now = Date.now();
		let newCaches: ICache[] = caches;
		for (let i = 0; i < caches.length; i++) {
			const cache = caches[i];
			if (now - cache.time > configuredCacheDuration) {
				deleteCacheValue(cache);
				newCaches = [];
			} else {
				// the cache array is ordered, so if we encounter a cache that shouldn't be deleted, it means the rest of them
				// should be preserved, so a slice is enough
				// we don't even need to bother slicing the cache array if this the very first cache
				if (i)
					newCaches = caches.slice(i);
				break;
			}
		}

		caches = newCaches;

		if (caches.length === 0 && garbageCollectionTimer !== undefined) {
			clearInterval(garbageCollectionTimer);
			garbageCollectionTimer = undefined;
		}
	}, Math.sqrt(configuredCacheDuration / 1000) * 2000);
}

module Cached {
	export function getObjectsCount () {
		return caches.length;
	}

	export function isGarbageCollectorRunning () {
		return garbageCollectionTimer !== undefined;
	}

	export function clear () {
		caches.forEach(deleteCacheValue);
		caches = [];
	}

	export function resetCacheDuration () {
		setDuration(DEFAULT_CACHE_DURATION);
	}

	export function setDuration (ms: number) {
		if (configuredCacheDuration !== ms) {
			configuredCacheDuration = ms;
			handleCacheGarbageCollection(true);
		}
	}

	export function resetLimit () {
		setLimit(DEFAULT_CACHE_LIMIT);
	}

	export function setLimit (count: number) {
		configuredCacheLimit = count;
		while (caches.length > configuredCacheLimit)
			deleteCacheValue(caches.shift()!);
		handleCacheGarbageCollection(true);
	}
}

export default Cached;
