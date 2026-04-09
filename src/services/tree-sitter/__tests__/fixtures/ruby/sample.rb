# RubyClass is a sample class.
class RubyClass
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  # get_name returns the name.
  def get_name
    @name
  end

  def calculate(a, b)
    a + b
  end
end

# top_level_func is a top-level function.
def top_level_func(x)
  obj = RubyClass.new("example")
  puts obj.get_name
  obj.calculate(x, 10)
end

top_level_func(5)

module SampleModule
  def self.module_func
    "hello"
  end

  class NestedClass
    def nested_method
      "nested"
    end
  end
end
