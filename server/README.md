# Servidor API - Filmes

API REST desenvolvida com Spring Boot para gerenciamento de filmes.

## 🚀 Como executar

### Opção 1: Usando Maven (Recomendado)

**Windows (PowerShell/CMD):**
```powershell
# Navegar para a pasta do servidor
cd server

# Executar o servidor
mvn spring-boot:run
```

**Mac/Linux:**
```bash
# Navegar para a pasta do servidor
cd server

# Executar o servidor
mvn spring-boot:run
```

### Opção 2: Usando Maven Wrapper

**Windows (PowerShell/CMD):**
```powershell
cd server
mvnw.cmd spring-boot:run
```

**Mac/Linux:**
```bash
cd server
# Dar permissão de execução ao script (apenas na primeira vez)
chmod +x mvnw
./mvnw spring-boot:run
```

## 📦 Outras opções

### Compilar e gerar o JAR

**Windows:**
```powershell
mvnw.cmd clean package
java -jar target\api-0.0.1-SNAPSHOT.jar
```

**Mac/Linux:**
```bash
./mvnw clean package
java -jar target/api-0.0.1-SNAPSHOT.jar
```

### Executar testes

**Windows:**
```powershell
mvnw.cmd test
```

**Mac/Linux:**
```bash
./mvnw test
```

## 🔧 Requisitos

- Java 17 ou superior
- Maven 3.6+ (opcional se usar Maven Wrapper)

## 📍 Endpoints

O servidor roda por padrão em: `http://localhost:8081`

## 🗄️ Banco de Dados

O projeto utiliza H2 Database (banco em memória) para desenvolvimento.

- Console H2: `http://localhost:8081/h2-console`
- JDBC URL: `jdbc:h2:mem:filmesdb`
- Username: `sa`
- Password: _(deixe em branco)_
