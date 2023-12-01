export function hasProps<T, U extends string | number | symbol>(obj: T, ...propName: U[]) : obj is T & {[P in U]: unknown} {
	return !!obj // ensure not nullish
	&& (typeof obj === "object" || typeof obj === "function") // ensure not primitive.
	&& propName.every((p: U) : boolean => p in obj); // ensure every properties is in object.
}