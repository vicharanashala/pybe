import matplotlib.pyplot as plt

regions = ["N. America", "Europe", "APAC", "LATAM", "MEA"]
conversion = [18.4, 14.1, 11.3, 8.2, 5.9]  # trial-to-paid rate in %

plt.bar(regions, conversion)

plt.title("Trial-to-paid conversion by region")
plt.xlabel("Region")
plt.ylabel("Trial to paid (%)")

plt.show()
