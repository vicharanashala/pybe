def last_index_pybe(main_str, sub_str):
  for i in range(len(main_str) - len(sub_str), -1, -1):
    if main_str[i:i + len(sub_str)] == sub_str:
      return i
  return -1

def last_index_gemini(main_str, sub_str):
  for i in range(len(main_str) - len(sub_str), -2, -1):
    if main_str[i:i + len(sub_str)] == sub_str:
      return i
  return -1

print("Pybe hello, ll:", last_index_pybe("hello", "ll"))
print("Gemini hello, ll:", last_index_gemini("hello", "ll"))
print("Pybe abc, xyz:", last_index_pybe("abc", "xyz"))
print("Gemini abc, xyz:", last_index_gemini("abc", "xyz"))

print("Pybe hello, o:", last_index_pybe("hello", "o"))
print("Gemini hello, o:", last_index_gemini("hello", "o"))

print("Pybe hello, hello:", last_index_pybe("hello", "hello"))
print("Gemini hello, hello:", last_index_gemini("hello", "hello"))

print("Pybe hello, x:", last_index_pybe("hello", "x"))
print("Gemini hello, x:", last_index_gemini("hello", "x"))
