namespace NeuroFramework.Libraries.Testing.Tests;

[TestClass]
public class GreetingTests {
  [TestMethod]
  public void HelloTest() {
    var greeting = new Greeting("John");
    Assert.AreEqual("Hello John", greeting.Hello());
  }
  [TestMethod]
  public void ByeTest() {
    // backend test
    var greeting = new Greeting("John");
    Assert.AreEqual("Bye John", greeting.Bye());
  }
}