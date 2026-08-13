# The Cat as Judge — Validating input

> **Concept:** Validating input · **Difficulty:** Explorer · **Source:** Panchatantra · public domain · original retelling
> _Alternate telling for **Validating input** — see also [The Fox and the Crow](11-fox-and-crow.md)._

## The story

The partridge went away for a season, and when she came back a hare was living in her burrow. She said it was hers because she had dug it. He said it was his because it had been empty when he found it. Neither of them was lying.

They agreed to put it to someone outside the quarrel. Down at the river there was an old cat who sat very still with his eyes shut, and everyone along that bank said he had given up meat years ago and lived on air and river water.

He said he was glad they had come. He said his hearing had gone with age and they would have to come closer, since a judge who cannot hear the case cannot rule on it fairly. He said this without opening his eyes.

They came close enough to be heard, and that was the end of the case. Everything anyone knew about the judge, the judge had said about himself, and nobody had thought to check it against anything else.

## The bridge

Every fact they had about the judge was a fact the judge had supplied.

| In the story | In Python | Why |
|---|---|---|
| His holiness, his age, his deafness | Fields inside the incoming data | All of it arrived from the thing being judged. A value that describes itself has told you what it wants you to believe. |
| Everyone along the bank saying so | A reputation the source controls | The corroboration came from the same place as the claim. Repeating an assertion does not turn it into a check. |
| Come closer so I can hear you | A validation step the source designed | The instruction sounds like due process. It was written by the party it is meant to constrain. |
| Checking him against nothing | if data["verified"]: trust(data) | The condition passes exactly when the sender wants it to. Nothing was verified except that the sender said so. |

### The same rule, in Python

```python
def accept(order):
    print("accepted:", order["item"])

order = {"item": "lamp", "quantity": 4, "verified": True}

# the cat’s own account of himself
if order["verified"]:
    accept(order)        # accepted: lamp — and nothing was checked

# something the sender cannot set
TRUSTED = {"shop-a", "shop-b"}
if order.get("source") in TRUSTED and 0 < order["quantity"] <= 50:
    accept(order)        # silent: no trusted source, so this one does not pass

name = "report.png"
print(name.endswith(".png"))   # True — and the uploader chose the name
```

The first check reads a field out of the parcel and asks the parcel whether the parcel is fine. It prints accepted, because it passes whenever the sender wants it to — which means it is not a check. The second compares against a set that lives on your side and a range you decided, neither of which the sender can reach, and it stays silent: this order carries no trusted source, so it does not get through. The last line is the same trap in its commonest costume — a filename ending in .png is a claim, not a fact about the file.

**Where it breaks:** The crow at least got real information from the fox. Here the whole of the evidence is the source describing itself, which is a check that passes by construction. Watch for anything the sender both supplies and is judged by: a verified flag in a payload, a Content-Type header, a file extension, a role field in an unsigned token. Validate against something you hold — a signature you compute, a record you look up, a list you own — and treat everything in the parcel as a claim.

## Check yourself

**1. Find it in the story.** Which part of the story is the check that could never have failed?

- A) The cat's own account of his holiness and his deafness
- B) The partridge and the hare disagreeing about the burrow
- C) Choosing to ask someone outside the quarrel
- D) Coming closer so that he could hear

**2. Read the Python.** An order arrives from outside your system as {"item": "lamp", "quantity": 4, "verified": true}. Which line is an actual check?

- A) if order.get("source") in TRUSTED and 0 < order["quantity"] <= 50:
- B) if order["verified"]:
- C) if isinstance(order["quantity"], int):
- D) if "verified" in order and "quantity" in order:

**3. Somewhere new.** Your site lets people upload a profile picture. The handler accepts the file if its name ends in .png and the browser's Content-Type header says image/png. What is wrong with that?

- A) Both the filename and the header are chosen by whoever is uploading, so neither one checks anything
- B) Nothing is wrong, because two independent checks are being made
- C) It is too strict, and will reject valid images that use .jpg
- D) The header should be checked before the filename, not after

<details><summary>Answer key</summary>

1. **A** — It is evidence produced by the thing being evaluated. A test whose input the subject controls returns whatever the subject wants, so it passes by construction — nothing was ever actually examined.
2. **A** — TRUSTED is a set you hold and the range is one you decided, so neither can be altered by whoever sent the order. This compares the claim against something the sender cannot reach.
3. **A** — They are two claims from the same source, which is one claim. Anyone can name a file report.png and send whatever header they like — the cat telling you twice that he is holy.

</details>
