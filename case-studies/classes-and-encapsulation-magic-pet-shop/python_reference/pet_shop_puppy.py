"""
🐾 Buddy's Magic Pet Shop — Python OOP Encapsulation Reference

Demonstrates how to protect an object's internal data using:
1. Private attributes with double underscores (__health, __happiness)
2. Safe methods (heal, feed, play, nap) with validation rules
3. Getters and Setters / @property
"""

class MagicalPuppy:
    def __init__(self, name="Buddy"):
        self.name = name
        # 🔒 Private variables protected by Capsule!
        self.__health = 100
        self.__happiness = 100
        self.__energy = 100

    # 🔍 Getter: Safely view health without direct tampering
    @property
    def health(self):
        return self.__health

    # 🛡️ Setter: Smart gatekeeper with validation
    @health.setter
    def health(self, new_val):
        if not isinstance(new_val, (int, float)):
            raise TypeError("Health must be a number!")
        if 0 <= new_val <= 100:
            self.__health = new_val
        else:
            print(f"[BLOCKED] {new_val} is out of healthy puppy bounds (0-100)!")

    # 🔍 Getter: Safely view happiness
    @property
    def happiness(self):
        return self.__happiness

    # 🛡️ Setter: Smart gatekeeper for happiness
    @happiness.setter
    def happiness(self, new_val):
        if 0 <= new_val <= 100:
            self.__happiness = new_val
        else:
            print(f"[BLOCKED] Happiness must be between 0 and 100!")

    # 🔍 Getter: Safely view energy
    @property
    def energy(self):
        return self.__energy

    # 🦴 Caring Method: Heal Buddy safely
    def heal(self, amount):
        if amount > 0:
            self.__health = min(100, self.__health + amount)
            print(f"[TREAT] Yummy treat! {self.name}'s health is now {self.__health} (Health)")
        else:
            print("[BLOCKED] Cannot heal with negative or zero medicine!")

    # 🎾 Caring Method: Play fetch
    def play(self):
        if self.__energy >= 15:
            self.__happiness = min(100, self.__happiness + 25)
            self.__energy = max(0, self.__energy - 15)
            print(f"[PLAY] Woof! {self.name} loved playing fetch! Happy: {self.__happiness}, Energy: {self.__energy}")
        else:
            print(f"[SLEEPY] {self.name} is too sleepy to play! Needs a cozy nap first.")

    # 🛏️ Caring Method: Cozy Nap
    def nap(self):
        self.__energy = min(100, self.__energy + 35)
        self.__health = min(100, self.__health + 10)
        print(f"[NAP] Zzz... {self.name} woke up energized! Energy: {self.__energy}")

    def __repr__(self):
        return f"<MagicalPuppy {self.name}: Health={self.__health}, Happy={self.__happiness}, Energy={self.__energy}>"


if __name__ == "__main__":
    buddy = MagicalPuppy("Buddy")
    print("🐾 Created:", buddy)

    # Testing Safe Methods
    buddy.play()
    buddy.heal(20)
    buddy.nap()

    # Testing Encapsulation Protection:
    print("\n--- Testing Direct Attribute Access (Protected!) ---")
    try:
        # Attempting direct access to private variable
        val = buddy.__health
    except AttributeError:
        print("🛡️ Success: buddy.__health is locked and cannot be read directly!")

    # Safe Property Access
    print(f"🔍 Reading health via property: {buddy.health} ❤️")

    # Safe Setter with Validation
    buddy.health = 90
    print(f"✅ Set health to valid value: {buddy.health} ❤️")

    # Invalid Setter Attempt (Blocked by capsule rules)
    buddy.health = -999
    print(f"🛡️ Health after invalid setter attempt: {buddy.health} ❤️ (Untouched!)")
