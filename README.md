# Industrial Transformer Dashboard (WAGO CC100)

Lekki, przemysłowy dashboard HMI do monitoringu transformatorów.

## Instalacja:
1. Pobierz repozytorium do dowolnego folderu na sterowniku lub użyj Portainera.
2. W Portainerze stwórz nowy **Stack** korzystając z pliku `docker-compose.yml`.
3. Dashboard ruszy na porcie **8000**.

## Konfiguracja:
- **Dostęp**: `http://<IP_STEROWNIKA>:8000`
- **Node-RED**: Importuj `node-red-flow.json`.
- **WebSocket**: `ws://<IP_STEROWNIKA>:1880/ws/transformer`

## Porty:
Zastosowano port **8000**, aby nie blokować systemowego interfejsu WAGO Web-Based Management (port 80).
