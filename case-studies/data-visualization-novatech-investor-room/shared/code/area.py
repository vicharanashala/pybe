import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
core_ai = [5, 7, 10, 13, 16, 20]
flow_crm = [4, 5, 7, 9, 11, 12]
signal_api = [2, 3, 5, 6, 7, 9]
other = [1, 3, 3, 4, 4, 4]

plt.stackplot(months, core_ai, flow_crm, signal_api, other,
              labels=["Core AI", "Flow CRM", "Signal API", "Other"])

plt.legend(loc="upper left")
plt.title("Revenue by product")
plt.xlabel("Month")
plt.ylabel("Revenue ($K)")

plt.show()
