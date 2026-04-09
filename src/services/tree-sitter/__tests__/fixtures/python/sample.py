import os

class PythonClass:
    """
    A sample class in Python.
    """
    def __init__(self, name: str):
        self.name = name

    @property
    def get_name(self) -> str:
        """
        A property decorator.
        """
        return self.name

    def calculate(self, a: int, b: int) -> int:
        """
        A method with parameters.
        """
        return a + b

def top_level_func(x: int):
    """
    A top-level function in Python.
    """
    obj = PythonClass("example")
    print(obj.get_name)
    return obj.calculate(x, 10)

def outer_func(x):
    """
    Outer function in Python.
    """
    def inner_func(y):
        """
        Inner function.
        """
        return x + y

    class NestedClass:
        """
        Nested class in Python.
        """
        def nested_method(self):
            return inner_func(10)

    return NestedClass().nested_method()

class ComplexDecorators:
    @property
    @staticmethod
    def multiple_decorators():
        """
        Method with multiple decorators.
        """
        return "multiple"

    # Comment between decorator and function
    @classmethod
    def with_comment(cls):
        return "commented"

shadowed = "global"
def shadowing_func():
    shadowed = "local"
    print(shadowed)

if __name__ == "__main__":
    top_level_func(5)
    outer_func(10)
    shadowing_func()
    top_level_func(5)
