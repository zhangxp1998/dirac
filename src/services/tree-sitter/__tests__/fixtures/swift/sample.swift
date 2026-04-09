import Foundation

/// SwiftClass is a sample class.
class SwiftClass {
    var name: String

    init(name: String) {
        self.name = name
    }

    /// getName returns the name.
    func getName() -> String {
        return self.name
    }

    func calculate(a: Int, b: Int) -> Int {
        return a + b
    }
}

/// topLevelFunc is a top-level function.
func topLevelFunc(x: Int) -> Int {
    let obj = SwiftClass(name: "example")
    print(obj.getName())
    return obj.calculate(a: x, b: 10)
}

topLevelFunc(x: 5)

struct MyStruct {
    func structMethod() {
        print("struct")
    }
}

extension SwiftClass {
    func extensionMethod() {
        print("extension")
    }
}
