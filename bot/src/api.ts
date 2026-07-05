import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

export const startApiServer = (provider: any) => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    app.post('/api/campaign', async (req, res) => {
        try {
            const { campaignId, message, audience, users } = req.body;
            
            if (!message || !users || !Array.isArray(users)) {
                return res.status(400).json({ error: 'Faltan parámetros o usuarios.' });
            }

            let sentCount = 0;
            console.log(`🚀 Iniciando campaña masiva ID: ${campaignId}`);

            for (const user of users) {
                if (user.phone) {
                    try {
                        // Enviar mensaje vía Meta Provider
                        // El formato suele requerir el número limpio con código de país
                        const number = user.phone.replace(/\D/g, '');
                        await provider.sendMessage(`${number}@c.us`, message, {});
                        sentCount++;
                    } catch (e) {
                        console.error(`Error enviando a ${user.phone}:`, e);
                    }
                }
            }

            // Actualizar Supabase
            if (campaignId) {
                await supabase
                    .from('campaigns')
                    .update({ status: 'completed', sent_count: sentCount })
                    .eq('id', campaignId);
            }

            res.status(200).json({ success: true, sent: sentCount });
        } catch (error) {
            console.error('Error en /api/campaign:', error);
            res.status(500).json({ error: 'Error interno' });
        }
    });

    const API_PORT = 3031;
    app.listen(API_PORT, () => {
        console.log(`🛸 Hawkins Admin API escuchando en el puerto ${API_PORT}`);
    });
};
