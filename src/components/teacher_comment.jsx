import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';

const TeacherComments = ({ comments = [], onAddComment, isLoading }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400 flex items-center">
                <MessageSquare className="mr-2" size={20} />
                Comentarios y Retroalimentación
            </h4>

            {/* Lista de comentarios existentes */}
            <div className="space-y-3 mb-4">
                <AnimatePresence>
                    {comments.map((comment, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors"
                        >
                            <p className="text-gray-200">{comment.texto}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(comment.fecha).toLocaleString()}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Formulario para nuevo comentario */}
            <form onSubmit={handleSubmit} className="space-y-2">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario o retroalimentación..."
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                />
                <div className="flex justify-end">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading || !newComment.trim()}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                            isLoading || !newComment.trim()
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } transition-colors`}
                        type="submit"
                    >
                        <Send size={18} />
                        <span>{isLoading ? 'Enviando...' : 'Enviar Comentario'}</span>
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default TeacherComments;