const request = require('supertest');
const express = require('express');

// Importe o seu aplicativo Express
const app = require('./server.js'); // Altere para o caminho real do seu arquivo de aplicativo Express

describe('Testes para API do Golden Raspberry Awards', () => {
    it('Deve retornar os dados dos produtores', async () => {
        const response = await request(app).get('/raspberries/interval');
        expect(response.status).toBe(200);
        expect(response.body.min.length).toBeGreaterThan(0); // Verificar se há dados para o produtor com maior intervalo
        expect(response.body.max.length).toBeGreaterThan(0); // Verificar se há dados para o produtor mais rápido
        // Adicione mais asserções conforme necessário
    });

    it('Deve retornar o produtor com maior intervalo entre dois prêmios consecutivos e o mais rápido', async () => {
        const response = await request(app).get('/raspberries/interval');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('min');
        expect(response.body).toHaveProperty('max');
        // Adicione mais asserções conforme necessário
    });
});