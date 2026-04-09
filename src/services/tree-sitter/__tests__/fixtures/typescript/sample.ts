/**
 * This is a sample interface.
 */
interface MyInterface {
	id: string
	getName(): string
}

/**
 * This is a sample class implementing an interface.
 */
class MyClass implements MyInterface {
	id = "123"

	/**
	 * Gets the name.
	 */
	getName(): string {
		return "MyClass"
	}

	/**
	 * A method with parameters.
	 * @param x The first parameter.
	 * @param y The second parameter.
	 */
	processData(x: number, y: number): number {
		return x + y
	}
}

/**
 * A top-level function.
 */
function topLevelFunction() {
	const instance = new MyClass()
	console.log(instance.getName())
	console.log(instance.processData(1, 2))
}

/**
 * A nested scenario.
 */
function outerFunction(x: number) {
	/**
	 * Inner function.
	 */
	function innerFunction(y: number) {
		return x + y
	}

	class NestedClass {
		/**
		 * Nested method.
		 */
		nestedMethod() {
			return innerFunction(10)
		}
	}

	return new NestedClass().nestedMethod()
}

/**
 * A function with multiple decorators.
 */
function decorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {}

class DecoratedClass {
	@decorator
	@decorator
	methodWithDecorators() {
		return "decorated"
	}
}

/**
 * Shadowing test.
 */
const shadowed = "global"
function shadowingFunction() {
	const shadowed = "local"
	console.log(shadowed)
}

export { MyClass, topLevelFunction, outerFunction, DecoratedClass, shadowingFunction }
