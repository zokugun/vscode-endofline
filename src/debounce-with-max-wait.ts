export function debounceWithMaxWait<T extends (...args: any[]) => void>(
	action: T,
	filter: (...args: Parameters<T>) => boolean,
	wait: number,
	maxWait: number,
): T {
	let timeout: NodeJS.Timeout | undefined;
	let maxTimeout: NodeJS.Timeout | undefined;
	let lastArgs: Parameters<T> | undefined;
	let lastThis: any;

	function invoke() {
		action.apply(lastThis, lastArgs!);
		clearTimeout(timeout);
		clearTimeout(maxTimeout);
		timeout = undefined;
		maxTimeout = undefined;
	}

	return function (this: any, ...args: Parameters<T>) {
		if(!filter(...args)) {
			return;
		}

		// eslint-disable-next-line unicorn/no-this-assignment,@typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-this-alias
		lastThis = this;
		lastArgs = args;

		clearTimeout(timeout);
		timeout = setTimeout(invoke, wait);

		maxTimeout ||= setTimeout(invoke, maxWait);
	} as T;
}
