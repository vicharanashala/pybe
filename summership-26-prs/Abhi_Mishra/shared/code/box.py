import matplotlib.pyplot as plt

contracts = [12, 14, 15, 15, 16, 18, 18, 19, 20, 21, 22, 22, 24, 25, 26, 27,
             28, 30, 31, 33, 35, 36, 38, 40, 42, 45, 52, 140, 185,
             260]  # contract value per customer, in $K

plt.boxplot(contracts, showmeans=True)  # green triangle = mean

plt.title("Contract value per customer")
plt.ylabel("Contract value ($K)")
plt.xticks([1], ["All customers"])

plt.show()
