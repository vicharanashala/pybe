import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
revenue = [12, 18, 25, 32, 38, 45]  # in $K

plt.plot(months, revenue, marker="o")

plt.title("NovaTech monthly revenue")
plt.xlabel("Month")
plt.ylabel("Revenue ($K)")
plt.ylim(0, 50)

plt.show()
