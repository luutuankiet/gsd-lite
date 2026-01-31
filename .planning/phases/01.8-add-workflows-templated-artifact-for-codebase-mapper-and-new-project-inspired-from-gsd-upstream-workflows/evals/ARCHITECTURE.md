# Architecture

## High-Level Data Flow
```mermaid
graph TD
    User((User)) -->|HTTPS/443| CF[Cloudflare]
    CF -->|Traffic| Traefik[Traefik Reverse Proxy]
    
    subgraph "Docker Host (Hetzner)"
        Traefik -->|Routing| FrontendNet[Frontend Network]
        
        subgraph "Services"
            FrontendNet --> N8N
            FrontendNet --> Lightdash
            FrontendNet --> RSS[FreshRSS/Linkding]
            FrontendNet --> MetaMCP
            FrontendNet --> Crawl4AI
            FrontendNet --> Firefox
        end
        
        subgraph "Persistence"
            N8N -->|Mount| VolN8N[./n8n-docker/persistent]
            Lightdash -->|Mount| VolLD[./lightdash_docker/persistent]
            MetaMCP -->|Mount| VolMCP[./mcp/metamcp/persistent]
        end
    end
```

## Network Topology
- **Edge:** Cloudflare -> Traefik
- **Internal:** Docker Bridge Network (`frontend`)
- **Isolation:**
  - Most services sit on `frontend` to be reachable by Traefik.
  - No database-only isolation network observed yet (DBs like Postgres are also on `frontend` in Lightdash/MetaMCP compose files).

## Service Discovery
- **Static:** File-based configuration in `traefik/config/hosts.yaml`.
- **Dynamic:** Labels usage commented out in `rss-docker` (migrated to static file?).

## Scale
- **Vertical Scaling:** Single node architecture.
- **Resource Limits:** Explicit limits seen on `crawl4ai` (4GB RAM).