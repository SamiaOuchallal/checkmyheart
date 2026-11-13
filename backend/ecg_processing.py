
import numpy as np
from scipy.signal import butter, sosfiltfilt


def filter_ecg(
    times: list[float],
    amplitudes: list[float],
    lowcut: float = 0.5,
    highcut: float = 40.0
) -> list[float]:
    """
    Applique un filtre passe-bande à un signal ECG échantillonné.

    times : temps en secondes
    amplitudes : valeurs ECG
    """

    time_array = np.asarray(times, dtype=float)
    ecg_array = np.asarray(amplitudes, dtype=float)

    if len(time_array) != len(ecg_array):
        raise ValueError("Les tableaux doivent avoir la même longueur.")

    if len(time_array) < 20:
        raise ValueError("Le signal est trop court pour le filtrage.")

    # Calculer les intervalles entre les échantillons
    intervals = np.diff(time_array)

    if not np.all(np.isfinite(time_array)) or not np.all(np.isfinite(ecg_array)):
        raise ValueError("Le signal contient des valeurs non finies.")

    if np.any(intervals <= 0):
        raise ValueError("Les temps doivent être strictement croissants.")

    # Vérifier que l'échantillonnage est régulier
    median_interval = float(np.median(intervals))

    if not np.allclose(
        intervals,
        median_interval,
        rtol=0.01,
        atol=1e-9
    ):
        raise ValueError(
            "Le filtrage nécessite un échantillonnage régulier."
        )

    sampling_frequency = 1.0 / median_interval
    nyquist_frequency = sampling_frequency / 2.0

    if not (0 < lowcut < highcut < nyquist_frequency):
        raise ValueError(
            "Fréquence d'échantillonnage incompatible avec le filtre."
        )

    # Construire un filtre passe-bande Butterworth
    sos = butter(
        N=4,
        Wn=[lowcut, highcut],
        btype="bandpass",
        fs=sampling_frequency,
        output="sos"
    )

    # Filtrage dans les deux sens pour limiter le décalage temporel des formes d'onde
    filtered = sosfiltfilt(sos, ecg_array)

    return filtered.tolist()
