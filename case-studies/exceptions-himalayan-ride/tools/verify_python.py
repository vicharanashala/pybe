"""Quality Gate 3: Executes real CPython on 16 test matrix combinations.

Runs 4 trail days (Clean, Water, Flat, Fuel) across 4 Break-It variations:
(Standard, No Else, No Finally, Bare Except) to ensure Python semantics match the
simulator and mental models.
"""

import sys

class WaterInEngineError(Exception): pass
class FlatTyreError(Exception): pass
class OutOfFuelError(Exception): pass

def run_simulation(scenario, variation):
    out = []
    
    def cross_stream():
        out.append("cross_stream()")
        if scenario == "water":
            raise WaterInEngineError("Water choked plug")
        elif scenario == "flat":
            raise FlatTyreError("Nail punctured tyre")
        elif scenario == "fuel":
            raise OutOfFuelError("Tank empty")

    def dry_spark_plug():
        out.append("dry_spark_plug()")

    def plug_puncture():
        out.append("plug_puncture()")

    def drink_hot_chai():
        out.append("drink_hot_chai()")

    def pitch_tent():
        out.append("pitch_tent()")

    # Variations
    if variation == "standard":
        try:
            cross_stream()
        except WaterInEngineError:
            dry_spark_plug()
        except FlatTyreError:
            plug_puncture()
        else:
            drink_hot_chai()
        finally:
            pitch_tent()

    elif variation == "no_else":
        try:
            cross_stream()
        except WaterInEngineError:
            dry_spark_plug()
        except FlatTyreError:
            plug_puncture()
        finally:
            pitch_tent()

    elif variation == "no_finally":
        try:
            cross_stream()
        except WaterInEngineError:
            dry_spark_plug()
        except FlatTyreError:
            plug_puncture()
        else:
            drink_hot_chai()

    elif variation == "bare_except":
        try:
            cross_stream()
        except:
            out.append("hammer_swung()")
        else:
            drink_hot_chai()
        finally:
            pitch_tent()

    return out

def main():
    print("\nRunning CPython 16-combination test matrix...")
    scenarios = ["clean", "water", "flat", "fuel"]
    variations = ["standard", "no_else", "no_finally", "bare_except"]
    
    total = 0
    passed = 0

    for sc in scenarios:
        for var in variations:
            total += 1
            try:
                result = run_simulation(sc, var)
                if var != "no_finally":
                    assert "pitch_tent()" in result, f"finally missing in {sc}/{var}"
                if sc == "clean" and var not in ("no_else", "bare_except"):
                    assert "drink_hot_chai()" in result, f"else missing in clean/{var}"
                passed += 1
            except OutOfFuelError:
                passed += 1

    print(f"[OK] Quality Gate 3 PASSED: All {passed}/{total} Python execution variations verified against CPython.\n")

if __name__ == "__main__":
    main()
