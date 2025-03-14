import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import UserFormModal from "../UserFormModal";

// Mock das funções de callback
const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

describe("UserFormModal", () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    mockOnClose.mockClear();
    mockOnSave.mockClear();
  });

  test("deve renderizar o modal corretamente quando aberto", () => {
    render(<UserFormModal open={true} onClose={mockOnClose} onSave={mockOnSave} />);

    // Verifica se os elementos principais estão presentes
    expect(screen.getByText("Adicionar Novo Usuário")).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/função/i)).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  test("deve não renderizar o modal quando fechado", () => {
    render(<UserFormModal open={false} onClose={mockOnClose} onSave={mockOnSave} />);

    // Verifica se o título não está visível quando o modal está fechado
    expect(screen.queryByText("Adicionar Novo Usuário")).not.toBeInTheDocument();
  });

  test("deve validar os campos e mostrar erros quando necessário", () => {
    render(<UserFormModal open={true} onClose={mockOnClose} onSave={mockOnSave} />);

    // Tenta salvar com campos vazios
    fireEvent.click(screen.getByText("Salvar"));

    // Verifica se as mensagens de erro aparecem
    expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Email válido é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Selecione uma função")).toBeInTheDocument();

    // Verifica se a função de salvar não foi chamada
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("deve chamar onSave quando o formulário for preenchido corretamente", () => {
    render(<UserFormModal open={true} onClose={mockOnClose} onSave={mockOnSave} />);

    // Preenche os campos
    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: "João Teste" }
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "joao@teste.com" }
    });

    // Seleciona uma função
    fireEvent.mouseDown(screen.getByLabelText(/função/i));
    fireEvent.click(screen.getByText("Usuário"));

    // Clica em salvar
    fireEvent.click(screen.getByText("Salvar"));

    // Verifica se onSave foi chamado com os dados corretos
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "João Teste",
        email: "joao@teste.com",
        role: "User",
        id: expect.any(Number)
      })
    );

    // Verifica se o modal foi fechado
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("deve limpar o formulário e fechar o modal ao cancelar", () => {
    render(<UserFormModal open={true} onClose={mockOnClose} onSave={mockOnSave} />);

    // Preenche um campo
    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: "Teste Cancelamento" }
    });

    // Clica em cancelar
    fireEvent.click(screen.getByText("Cancelar"));

    // Verifica se onClose foi chamado
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // Não deveria chamar onSave
    expect(mockOnSave).not.toHaveBeenCalled();
  });
});
