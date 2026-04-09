#include <iostream>
#include <string>

/**
 * A sample class in C++.
 */
class CppClass {
public:
    /**
     * Constructor.
     */
    CppClass(const std::string& name) : m_name(name) {}

    /**
     * An inline method.
     */
    std::string getName() const {
        return m_name;
    }

    /**
     * An out-of-line method declaration.
     */
    int calculate(int a, int b);

private:
    std::string m_name;
};

/**
 * Method implementation outside the class.
 */
int CppClass::calculate(int a, int b) {
    return a + b;
}

namespace MyNamespace {
    /**
     * A class within a namespace.
     */
    class NamespaceClass {
    public:
        void doSomething() {
            std::cout << "Doing something in MyNamespace" << std::endl;
        }

        class InnerClass {
        public:
            int innerMethod(int val) {
                return val * 2;
            }
        };
    };
}

/**
 * A top-level function.
 */
void cpp_main() {
    CppClass obj("test");
    std::cout << obj.getName() << std::endl;
    std::cout << obj.calculate(10, 20) << std::endl;

    MyNamespace::NamespaceClass nsObj;
    nsObj.doSomething();

    MyNamespace::NamespaceClass::InnerClass innerObj;
    std::cout << "Inner: " << innerObj.innerMethod(5) << std::endl;
}

int main() {
    cpp_main();
    return 0;
}