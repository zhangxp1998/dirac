/// A sample struct in Rust.
pub struct RustStruct {
    pub value: i32,
}

impl RustStruct {
    /// Creates a new instance.
    pub fn new(value: i32) -> Self {
        RustStruct { value }
    }

    /// Gets the value.
    pub fn get_value(&self) -> i32 {
        self.value
    }
}

/// A sample enum.
pub enum SampleEnum {
    First,
    Second(String),
}

/// A top-level function.
pub fn outer_rust() {
    /// Nested function in Rust.
    fn inner_rust(a: i32) -> i32 {
        a * 2
    }

    mod nested_mod {
        pub fn mod_func() {
            println!("Inside nested mod");
        }
    }

    nested_mod::mod_func();
    println!("Inner: {}", inner_rust(5));
}

pub trait SampleTrait {
    fn trait_method(&self);
}

impl SampleTrait for RustStruct {
    fn trait_method(&self) {
        println!("Trait method called for value: {}", self.value);
    }
}

pub fn rust_main() {
    let instance = RustStruct::new(42);
    println!("Value: {}", instance.get_value());
    outer_rust();
    instance.trait_method();
}
