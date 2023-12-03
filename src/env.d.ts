/// <reference types="astro/client" />
declare namespace App {
    interface Locals {
        title: string,
        state: string,
        auth: import("lucia").AuthRequest;
    }
}

/// <reference types="lucia" />
declare namespace lucia {
    type Auth = import('./lib/lucia').Auth
    type DatabaseUserAttributes = {
        username: string
    }
    type DatabaseSessionAttributes = {}
}