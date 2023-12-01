namespace NeuroFramework.Common.Waves.Tests;

[TestClass]
public class CalculatorTest {
  [TestMethod]
  public void AddTest() {
    Assert.AreEqual(3, Calculator.Add(1, 2));
  }
}