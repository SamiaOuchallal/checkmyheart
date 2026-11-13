
import csv
from ecg_processing import filter_ecg

times = []
amplitudes = []

with open(
    "test_ecg_long.csv",
    newline="",
    encoding="utf-8"
) as file:
    reader = csv.DictReader(file)

    for row in reader:
        times.append(float(row["time"]))
        amplitudes.append(float(row["ecg"]))

filtered = filter_ecg(times, amplitudes)

print("Points d'origine :", len(amplitudes))
print("Points filtrés :", len(filtered))
print("Première valeur brute :", amplitudes[0])
print("Première valeur filtrée :", filtered[0])
