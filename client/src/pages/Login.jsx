import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Loader from '@/components/Loader';

export default function Component() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isloading, setisloading] = useState(false);

    async function loginUser(e) {
        e.preventDefault();
        setisloading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
                credentials: "include",
            });
            if (!response.ok) {
                alert("Login failed!");
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.user) {
                setisloading(false);
                alert("Login successful!");
                window.location.href = "/dashboard";
            } else {
                setisloading(false);
                alert("Login failed!");
            }

        } catch (error) {
            setisloading(false);
            console.error("There was an error with the login request:", error);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md p-6 sm:p-8">
                <h4 className="text-slate-500 hover:underline"><NavLink to="/">Back to home</NavLink></h4>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Welcome back User</CardDescription>
                </CardHeader>
                <form className="space-y-4" onSubmit={loginUser}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="relative grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Enter a password" />
                    </div>
                    <CardFooter className="m-3">
                        <Button type="submit" className="w-full mt-[10px]">
                            {isloading ? <Loader /> : "Login"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
