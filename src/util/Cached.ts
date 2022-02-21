type AnyFunction = (...args: any[]) => any;

interface ICache {
	value?: any;
	time: number;
	map: Map<any, ICache>;
}

function Cached (target: any, key: string, descriptor: TypedPropertyDescriptor<AnyFunction>) {
	let topCache: ICache = { map: new Map(), time: 0 };
	return {
		value (...args: any[]) {
			let now = Date.now();

			let cache: ICache = topCache;

			for (let i = 0; i < args.length; i++) {
				const arg = args[i];
				let nextCache = cache.map.get(arg);
				if (!nextCache) cache.map.set(arg, nextCache = { map: new Map(), time: 0 });
				cache = nextCache;
			}

			if (now - cache.time < Cached.duration)
				return cache.value;

			cache.time = now;
			return cache.value = descriptor.value!.apply(this, args);
		},
	};
}

module Cached {
	export let duration = 1000 * 60 * 60 * 24; // 1 day default cache time
}

export default Cached;
