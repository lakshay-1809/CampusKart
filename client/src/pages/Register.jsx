import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Component() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("hosteller");

    async function registerUser(e) {
        e.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._%+-]+\.be(2[1-9]|30)@chitkara\.edu\.in$/;
        if (!emailPattern.test(email)) {
            alert("Only emails ending with .beXX@chitkara.edu.in (XX = 21-30) are allowed.");
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    type
                }),
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Register response:", data);
            if (data.status === "ok") {
                // Store token for cross-domain requests
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                alert("Registration successful!");
                window.location.href = "/dashboard";
            } else {
                console.error("Registration failed with response:", data);
                alert("Registration failed!");
            }
        } catch (error) {
            console.error("There was an error with the registration request:", error);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md p-6 sm:p-8 border-[2px]">
                <h4 className="text-slate-500 hover:underline"><NavLink to="/">Back to home</NavLink></h4>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Register</CardTitle>
                    <CardDescription>Create your account to get started.</CardDescription>
                </CardHeader>
                <form className="space-y-4" onSubmit={registerUser}>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={type} onValueChange={(value) => setType(value)}>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hosteller">Hosteller</SelectItem>
                                <SelectItem value="dayScholar">Day Scholar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit">Register</Button>
                </form>
            </Card>
        </div>
    );
}
