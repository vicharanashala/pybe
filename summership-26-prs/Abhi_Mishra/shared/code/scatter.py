import matplotlib.pyplot as plt

usage = [19, 13, 14, 18, 12, 16, 17, 5, 2, 7, 6, 18, 19, 1, 10, 17, 3, 16,
          3, 10, 17, 7, 7, 6, 15, 6]  # weekly usage in hours, one value per customer
months = [16, 13, 16, 14, 11, 11, 13, 1, 3, 5, 8, 18, 18, 1, 9, 16, 5, 12,
           3, 8, 14, 11, 6, 7, 17, 6]  # months each customer has stayed

plt.scatter(usage, months)

plt.title("Weekly usage vs months stayed")
plt.xlabel("Weekly usage (hours)")
plt.ylabel("Months as a customer")

plt.show()
