type AnyFunction = (...args: any[]) => any;

interface ICache {
	value?: any;
	map: Map<any, ICache>;
}

let cacheTime = Date.now();

function Cached (target: any, key: string, descriptor: TypedPropertyDescriptor<AnyFunction>) {
	let topCache: ICache = { map: new Map() };
	let thisCacheTime = Date.now();
	return {
		value (...args: any[]) {
			let now = Date.now();
			if (now - cacheTime > Cached.duration)
				cacheTime = now;

			if (thisCacheTime < cacheTime)
				topCache = { map: new Map() };

			let cache: ICache = topCache;

			for (let i = 0; i < args.length; i++) {
				const arg = args[i];
				let nextCache = cache.map.get(arg);
				if (!nextCache) cache.map.set(arg, nextCache = { map: new Map() });
				cache = nextCache;
			}

			return cache.value ?? descriptor.value!.apply(this, args);
		},
	};
}

module Cached {
	export let duration = 1000 * 60 * 60 * 24; // 1 day default cache time
}

export default Cached;
