
# API Testing Interview Prep — HTTP, URL, DNS, Ports & Parameters

---

### 1) What is HTTP?

- HTTP stands for Hypertext Transfer Protocol.
- It's an application layer protocol, Layer 7 in the OSI model.
- It defines how clients like browsers and servers exchange messages using commands like GET, POST, PUT, DELETE.
- It's stateless, meaning every request is independent and the server doesn't remember previous requests.
- Data is sent in plain text, so it can be intercepted.
- Example: `http://example.com` is an unencrypted connection.

---

### 2) What is HTTPS and how is it different from HTTP?

- HTTPS is the secure version of HTTP that uses SSL/TLS encryption.
- It provides confidentiality by encrypting data, integrity by preventing data from being modified in transit, and authentication by verifying server identity using certificates.
- It works using public-key cryptography and establishes an encrypted channel before any actual data transfer happens.
- In short, HTTP gives functionality, HTTPS gives functionality plus security.
- Example: `https://example.com` is a secure connection compared to `http://example.com`.

---

### 3) Explain how HTTP request is not safe but HTTPS is with internal working? - Missing

### 3) What is a URL and what are its components?

- URL stands for Uniform Resource Locator.
- It's the complete address of a resource on the internet, telling the browser where the resource is and how to access it.
- It has three main parts: protocol, domain/host name, and path.
- The protocol like https:// defines the communication rules.
- The domain like www.example.com is the human-readable name that DNS converts into an IP address.
- The path like /products/item1.html points to the exact resource location on the server.
- Example: `https://www.example.com/products/item1.html`.

---

### 4) What happens when you enter a URL in the browser?

- First, the user enters the URL.
- The browser parses the URL and splits it into protocol, domain, and path.
- A DNS lookup happens to convert the domain into an IP address.
- The browser establishes a TCP/IP connection to the server on port 80 or 443.
- If it's HTTPS, an SSL/TLS handshake happens to set up encryption.
- The browser sends the HTTP request, for example GET /home.
- The server processes the request and fetches the required page or data.
- The server sends back the HTTP response containing HTML, JSON, or another resource.
- Finally, the browser renders the page using HTML, CSS, and JS.
- Example: typing `https://www.myapp.com` triggers this entire flow end to end.

---

### 5) Can you break down all the parts of a complete URL?

- Scheme or protocol, like https://, defines the communication protocol.
- Host or domain, like www.example.com, is the server name that DNS resolves into an IP address.
- Port, like :443, is the virtual endpoint where the server listens; defaults are 80 for HTTP and 443 for HTTPS.
- Path, like /path/to/resource, is the location of the resource on the server.
- Query string, like ?search=abc&sort=asc, carries extra parameters as key-value pairs separated by &.
- Fragment, like #section1, is an internal page reference that lets the browser jump to a section without making a new request.
- Example: `https://www.example.com:443/path/to/resource?search=abc#section1`.

---

### 6) What is a Domain, and how is it different on your local machine vs another machine?

- A domain is the human-readable name of a server, and it maps to an IP address behind the scenes.
- On your own machine, names like localhost or 127.0.0.1 always point to your own computer.
- On a different machine, localhost will point to that machine, not yours.
- In real networks, a local app might run on http://localhost:8080, while the same service on another machine could run on http://192.168.0.25:8080 or through a domain like dev.myapp.com.
- Example: `localhost:8080` on my laptop is completely different from `localhost:8080` on a colleague's laptop.

---

### 7) What is DNS and how does it work?

- DNS stands for Domain Name System, and it acts like the internet's phonebook.
- It converts domain names into IP addresses.
- When a user types a domain, the browser first checks its local DNS cache.
- If it's not found there, the browser sends a request to a DNS server.
- The DNS server replies with the corresponding IP address.
- The browser then uses that IP address to connect to the actual server.
- In simple terms, humans understand names, computers understand IPs, and DNS bridges that gap.
- Example: typing `www.google.com` gets resolved to an IP like 142.250.183.206.

---

### 8) What is the role of a Port in a URL?

- A port identifies which specific service on a server should handle the request.
- One server or IP can run multiple applications, each listening on a different port, like 80 for HTTP, 443 for HTTPS, 21 for FTP, and 3306 for MySQL.
- Without a port, the server wouldn't know which application should handle the incoming request.
- Example: `https://www.example.com:443/home` tells the browser to connect to the HTTPS service running on port 443.

---

### 9) Why don't we mention the port when writing https://www.google.com?

- Because default ports are automatically assumed by the browser.
- HTTP always defaults to port 80, and HTTPS always defaults to port 443.
- So even though we don't write it, the browser attaches the standard port internally.
- Example: `https://www.google.com` internally becomes `https://www.google.com:443`.

---

### 10) What are Default Ports?

- Default ports are standard, reserved port numbers used for common internet protocols.
- Browsers automatically use these when no port is mentioned in the URL.
- The common ones are 80 for HTTP, 443 for HTTPS, 21 for FTP, 22 for SSH, 25 for SMTP, and 53 for DNS.
- Example: `https://google.com` internally connects to `google.com:443`.

---

### 11) Can you explain the flow from local development to a live public domain?

- During development, the application runs locally, for example on http://localhost:3000 or http://localhost:8080.
- When the app is deployed on another machine in a LAN or server, we access it using that server's IP and port, like http://192.168.1.10:8080.
- The problem is that public users can't remember IP addresses, and IPs can also change over time.
- So the company buys a domain name, like myapp.com, and maps it to the server's IP using DNS records.
- Now instead of typing the IP directly, the user accesses the friendly domain, like https://www.myapp.com.
- When the user enters this URL, the browser parses it, does a DNS lookup to get the IP, connects on the default port, completes the HTTPS handshake, sends the HTTP request, and the server responds with the page which the browser then renders.
- Example: `https://34.102.182.12` eventually becomes accessible as `https://www.myapp.com`.

---

### 12) How can one server machine run multiple applications on different ports?

- A single server with one IP address can host multiple applications at the same time.
- Each application listens on a different port number, and the port works like a door number telling the OS which app should receive the request.
- Example: on the same IP, `10.0.0.5:8080` could be the backend API, `10.0.0.5:3000` the frontend React app, and `10.0.0.5:27017` the MongoDB server.

---

### 13) What is the difference between URL, URI, and Endpoint?

- A URL, or Uniform Resource Locator, is the full address of a resource, telling us where it is and how to access it.
- A URI, or Uniform Resource Identifier, is broader — it identifies a resource, and URL is actually a subset of URI. URI focuses on identity, URL focuses on location.
- An endpoint is a specific API resource exposed by the server that we can call.
- In short, URL is the complete web address, URI is an identifier inside a system, and endpoint is a callable resource of an API.
- Example: `https://www.example.com/users/123?active=true` is a URL, `/users/123` is a URI, and `GET /v1/drivers/{id}` is an endpoint.

---

### 14) What is the difference between Path Parameters and Query Parameters?

- Path parameters are part of the URL path and are used to identify one specific resource; they are mandatory and don't use "?" or "&".
- Query parameters come after the "?" in the URL and are used for filtering, searching, sorting, or pagination; they are optional and follow the key=value format.
- Example: `/drivers/123` uses a path parameter to fetch one driver, while `/drivers?page=2&limit=10&status=active` uses query parameters to filter a list of drivers.

---

### 15) Can you explain Path Parameters with some real examples?

- Path parameters are used to point to one specific resource in the system.
- They appear directly in the URL path and are required to identify that resource.
- Example: `GET /v1/drivers/9865` fetches the driver with ID 9865, and `GET /orders/001/items/05` fetches item 05 under order 001.

---

### 16) Can you explain Query Parameters with some real examples?

- Query parameters are used for filtering, sorting, searching, and pagination of a list of resources, not for identifying a single item.
- They are optional and appear after "?" in the URL, with multiple parameters separated by "&".
- Example: `GET /vehicles?year=2023&make=Honda` filters vehicles by year and make, and `GET /orders?page=4&limit=50` paginates the orders list.

---

### 17) What are Form Parameters, and how are they different from Path or Query Parameters?

- Form parameters are sent when an HTML form submits data to the server, mainly used in login forms, file uploads, and registration forms.
- They are usually sent using content types like application/x-www-form-urlencoded for simple key-value data, or multipart/form-data for file uploads.
- Compared to path parameters, which identify a specific resource, and query parameters, which filter or sort a list, form parameters carry the actual data payload being submitted to the server.
- Example: a login API `POST /login` with `Content-Type: application/x-www-form-urlencoded` sends data as `username=prince&password=Welcome123`.
