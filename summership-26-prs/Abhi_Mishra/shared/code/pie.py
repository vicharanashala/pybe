import matplotlib.pyplot as plt

products = ["Core AI", "Flow CRM", "Signal API", "Other"]
revenue = [71, 48, 32, 19]  # first-half revenue in $K

plt.pie(revenue, labels=products, autopct="%1.0f%%")

plt.title("Revenue by product (Jan to Jun)")

plt.show()
