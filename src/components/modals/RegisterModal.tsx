"use client";

import { useContext, useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

import { ModalContext } from "@/contexts/modalContext";
import { RegisterUserFormSchema } from "@/schemas/user";

import api from "@/services/api";
import ModalContainer from "./ModalContainer";
import DefaultInput from "../inputs/DefaultInput";
import SolidButton from "../buttons/SolidButton";

type RegisterUserFormData = z.infer<typeof RegisterUserFormSchema>;

const RegisterModal = () => {
	const { useLoginModal, useRegisterModal } = useContext(ModalContext);

	const [loading, setLoading] = useState(false);

	const loginModal = useLoginModal();
	const registerModal = useRegisterModal();

	const goToLogin = () => {
		registerModal.onClose();
		loginModal.onOpen();
	};

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterUserFormData>({
		resolver: zodResolver(RegisterUserFormSchema),
	});

	const signUp = async (data: RegisterUserFormData) => {
		setLoading(true);
		toast.loading("Cadastrando...");
		await api
			.post("/user", data)
			.then((res) => {
				setLoading(false);
				toast.dismiss();
				toast.success("Registrado");

				reset();
				goToLogin();
			})
			.catch((err) => {
				toast.dismiss();
				console.log(err);
				setLoading(false);
				if (err instanceof AxiosError) {
					toast.error(err.response?.data.message);
				}
			});
	};

	return (
		<ModalContainer
			isOpen={registerModal.isOpen}
			onClose={registerModal.onClose}
			title="Faça seu cadastro!"
		>
			<form className="space-y-6" onSubmit={handleSubmit(signUp)}>
				<DefaultInput
					id="image"
					label="Foto de Perfil (opcional)"
					register={register}
					error={!!errors.image}
					errorMessage={errors.image && errors.image.message}
				/>
				<DefaultInput
					id="name"
					label="Nome"
					register={register}
					error={!!errors.name}
					errorMessage={errors.name && errors.name.message}
				/>
				<DefaultInput
					id="email"
					label="Email"
					register={register}
					error={!!errors.email}
					errorMessage={errors.email && errors.email.message}
				/>
				<DefaultInput
					id="password"
					label="Senha"
					type="password"
					register={register}
					error={!!errors.password}
					errorMessage={errors.password && errors.password.message}
				/>
				<DefaultInput
					id="confirmPassword"
					label="Confirme a senha"
					type="password"
					register={register}
					error={!!errors.confirmPassword}
					errorMessage={errors.confirmPassword && errors.confirmPassword.message}
				/>
				<SolidButton label="Registrar" type="submit" />
				<div
					className="
                            w-full 
                            flex 
                            justify-center 
                            gap-1 
                            items-center
                            "
				>
					<div>Já possui um cadastro?</div>
					<button
						type="button"
						onClick={goToLogin}
						className="
                            underline 
                            text-indigo-500
                        "
						disabled={loading}
					>
						Entrar
					</button>
				</div>
			</form>
		</ModalContainer>
	);
};

export default RegisterModal;
