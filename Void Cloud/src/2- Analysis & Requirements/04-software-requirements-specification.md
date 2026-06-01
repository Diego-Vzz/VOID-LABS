### Web Platform (Next.js)
**REQ-F-01**: The system must allow users to register, log in, and recover their password.

**REQ-F-02**: The system must display to the user the status of their active subscription and the remaining days.

**REQ-F-03**: The system must provide a graphical interface where the user can enable/disable modules (AimAssist, AutoClicker, etc.) and adjust their values (slider, dropdowns).

**REQ-F-04**: The system must allow the user to create, save, edit, and delete multiple configuration profiles in the cloud (e.g. "Hypixel Legit", "Minemen").

**REQ-F-05**: The system must allow the user to open support tickets and request HWID resets through a form.

**REQ-F-06**: The system must provide an "Inject" button that sends the execution command to user's local loader.

### Backend an API (Fastify + Node.js)
**REQ-F-01**: The API must validate the JWT token and HWID on every HTTP request and WebSocket connection.

**REQ-F-02**: The system must automatically register the user's HWID on their fisrt succesful login through the loader.

**REQ-F-03**: The server must maintain persistent connections and route JSON commands from the web panel (Next.js) to the corresponding C++ client in under 50ms.

**REQ-F-04**: The system must process role-based permissions (USER, BETA, MDERATOR, ADMIN) to restrict access to experimental modules or admin panels.

### The Loader (C++ Injector)
**REQ-F-01**: (Web Authentication) In the process of defining the logic...

**REQ-F-02**: The Loader must calculate a unique SHA-256 hash based on the user's hardware (CPU, Disk, Registry) combined with a secret "salt".

**REQ-F-03**: The Loader must inject the DLL into the javaw.exe process by manually mapping the sections, without using LoadLibrary or registering the module in the operating system (PEB).

**REQ-F-04**: The Loader must pass the session token and HWID to the injected DLL through initialization agruments (IpReserved).

**REQ-F-05**: The Loader must overwrite (wipe) the DLL's PE headers int Minecraft's memory with zeros and terminate itself after a succesful injection.

### The Internal Client (C++ DLL in Minecraft)
**REQ-F-01**: The DLL must attach to the Java Virtual Machine (JVM) and resolve the main thread's ClassLoader to support clients such as Lunar Clinet or Forge.

**REQ-F-02**: The DLL must connect to the Fastify WebSockets and update its internal variables in real time when it receives a JSON with new configurations.

**REQ-F-03**: Combat modules must only act if the player is holding a valid weapon (sword/exe), is not in a menu (GUI), and the target is valid entity.

**REQ-F-04**: The client must not render any graphical interface (ImGui) with the game's OpenGL context that can be captured by recording software (OBS), delegating all visual control to the web.

**REQ-F-05**: The DLL must be able to unload its hooks, clean its global JNI references, and disconnect from the WebSockets if it receives a panic command or if the subscription expires in real time.

### Administration and Moderation (Backoffice)
**REQ-F-01**: The system must allow administrators to ban users, assign ban reasons, and modify roles.

**REQ-F-02**: The system must allow moderators to approve or reject HWID reset requests from a web panel.

**REQ-F-03**: The system must log critical actions (bans, HWID resets, IP changes) in an audit table for security review.