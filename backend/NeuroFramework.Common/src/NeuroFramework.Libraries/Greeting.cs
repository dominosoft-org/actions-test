using System.Diagnostics;

namespace NeuroFramework.Libraries;

/// <summary>
/// テスト
/// </summary>
public class Greeting {
  private readonly string _name;
  /// <summary>
  /// 
  /// </summary>
  /// <param name="name"></param>
  public Greeting(string name) {
    this._name = name;
  }
  public string Hello() {
    return $"Hello {this._name}";
  }
  public string Bye() {
    return $"Bye {this._name}";
  }
  /// <summary>
  /// 
  /// </summary>
  /// <param name="process"></param>
  public void Run(string process) {
    Debug.Assert(process != null);
  }
}
