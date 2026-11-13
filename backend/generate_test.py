
import csv
import numpy as np

sampling_frequency = 250
duration = 10

times = np.arange(
    0,
    duration,
    1 / sampling_frequency
)

rng = np.random.default_rng(42)

# Signal synthétique pédagogique :
# composantes périodiques et bruit
baseline = 0.15 * np.sin(2 * np.pi * 0.2 * times)
noise = 0.08 * rng.normal(size=len(times))

signal = 0.05 * np.sin(2 * np.pi * 5 * times)

# Ajouter des pics artificiels périodiques
for beat_time in np.arange(0.7, duration, 1.0):
    signal += np.exp(
        -0.5 * ((times - beat_time) / 0.015) ** 2
    )

ecg = signal + baseline + noise

with open(
    "test_ecg_long.csv",
    "w",
    newline="",
    encoding="utf-8"
) as file:
    writer = csv.writer(file)
    writer.writerow(["time", "ecg"])

    for time, amplitude in zip(times, ecg):
        writer.writerow([
            f"{time:.4f}",
            f"{amplitude:.6f}"
        ])

print(f"Fichier créé : {len(times)} points")
