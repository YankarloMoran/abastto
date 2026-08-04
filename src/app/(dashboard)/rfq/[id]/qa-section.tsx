'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, MessageCircleQuestion, Reply, MessagesSquare, HelpCircle, Lock, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react'
import { createQuestion, answerQuestion } from '@/actions/question'
import { Badge } from '@/components/ui/badge'

type QuestionItem = {
    id: string
    content: string
    answer: string | null
    createdAt: Date
    companyId: string
    company?: { name: string }
}

export default function QaSection({
    rfqId,
    questions,
    userRole,
    userCompanyId,
    isOwner,
    isActive
}: {
    rfqId: string,
    questions: QuestionItem[],
    userRole: string,
    userCompanyId: string,
    isOwner: boolean,
    isActive: boolean
}) {
    const [newQuestion, setNewQuestion] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // For Buyers replying
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState('')

    const handleAskQuestion = async () => {
        if (!newQuestion.trim()) return
        setIsSubmitting(true)
        setErrorMsg('')

        try {
            const res = await createQuestion(rfqId, newQuestion)
            if (res.error) {
                setErrorMsg(res.error)
            } else {
                setNewQuestion('')
            }
        } catch (err) {
            setErrorMsg('No se pudo enviar la pregunta.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReply = async (questionId: string) => {
        if (!replyContent.trim()) return
        setIsSubmitting(true)
        setErrorMsg('')

        try {
            const res = await answerQuestion(questionId, replyContent, rfqId)
            if (res.error) {
                setErrorMsg(res.error)
            } else {
                setReplyingTo(null)
                setReplyContent('')
            }
        } catch (err) {
            setErrorMsg('No se pudo publicar la respuesta.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="px-6 py-5 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <CardTitle className="text-lg md:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 font-outfit">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                            <MessagesSquare className="h-5 w-5" />
                        </div>
                        Foro de Preguntas Públicas y Aclaraciones
                    </CardTitle>
                    <Badge variant="outline" className="w-fit bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 font-bold px-3 py-1 text-xs">
                        {questions.length} {questions.length === 1 ? 'pregunta' : 'preguntas'} registradas
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                {!isActive && (
                    <div className="p-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
                        <Lock className="h-4 w-4 shrink-0 text-amber-500" />
                        El periodo de aclaraciones ha concluido de forma automática al alcanzarse la fecha límite del requerimiento.
                    </div>
                )}

                {/* Lista de Preguntas */}
                {questions.length === 0 ? (
                    <div className="text-center py-12 px-6 bg-slate-50/50 dark:bg-white/[0.02] rounded-3xl border border-dashed border-slate-200 dark:border-white/10 space-y-3">
                        <HelpCircle className="h-10 w-10 mx-auto text-slate-400 dark:text-slate-600" />
                        <h4 className="text-base font-bold text-slate-900 dark:text-white font-outfit">Sin consultas publicadas</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
                            Las dudas técnicas planteadas por los proveedores y las respuestas oficiales emitidas por el comprador se mostrarán en esta sección.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((q) => {
                            const isMyQuestion = q.companyId === userCompanyId;

                            return (
                                <div 
                                    key={q.id} 
                                    className={`p-5 rounded-2xl border transition-all duration-200 space-y-4 ${
                                        isMyQuestion 
                                            ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40' 
                                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-white/10'
                                    }`}
                                >
                                    {/* Header del Item */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 font-bold text-xs">
                                                <MessageCircleQuestion className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                                    {isMyQuestion ? 'Tu Empresa (Consulta Privada)' : 'Proveedor Participante'}
                                                </span>
                                                <span className="text-[0.7rem] text-slate-500 dark:text-slate-400 font-medium">
                                                    {new Date(q.createdAt).toLocaleDateString('es-GT', { timeZone: 'America/Guatemala', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>

                                        {isMyQuestion && (
                                            <Badge className="bg-blue-600 text-white font-bold text-[0.65rem] px-2.5 py-0.5 rounded-full">
                                                Tu Consulta
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Contenido de la Pregunta */}
                                    <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium pl-1">
                                        {q.content}
                                    </p>

                                    {/* Bloque de Respuesta Oficial */}
                                    {q.answer ? (
                                        <div className="mt-3 p-4 bg-amber-500/10 dark:bg-amber-500/15 rounded-xl border border-amber-500/20 space-y-2">
                                            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                                                <Reply className="w-4 h-4 shrink-0" />
                                                Respuesta Oficial de la Entidad Emisora
                                            </div>
                                            <p className="text-xs md:text-sm text-slate-900 dark:text-slate-100 font-medium leading-relaxed pl-6">
                                                {q.answer}
                                            </p>
                                        </div>
                                    ) : (
                                        /* Solo el Comprador Emisor ve el botón para responder si la licitación está activa */
                                        isOwner && isActive && (
                                            <div className="pt-2 border-t border-slate-200/60 dark:border-white/5">
                                                {replyingTo === q.id ? (
                                                    <div className="space-y-3 pt-2 animate-in fade-in">
                                                        <Textarea
                                                            className="w-full text-xs md:text-sm p-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 resize-none font-medium"
                                                            rows={3}
                                                            placeholder="Escribe aquí la aclaración oficial para todos los proveedores inscritos..."
                                                            value={replyContent}
                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                        />
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button 
                                                                type="button" 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                                                                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-9 px-5 rounded-xl cursor-pointer shadow-md"
                                                                onClick={() => handleReply(q.id)}
                                                                disabled={isSubmitting || !replyContent.trim()}
                                                            >
                                                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1.5" />}
                                                                Publicar Aclaración
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button 
                                                        type="button" 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => setReplyingTo(q.id)} 
                                                        className="text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold text-xs rounded-xl h-8 px-3 cursor-pointer"
                                                    >
                                                        <Reply className="w-3.5 h-3.5 mr-1.5" />
                                                        Responder esta consulta
                                                    </Button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Formulario para Crear Nueva Pregunta (Proveedores) */}
                {userRole === 'SUPPLIER' && isActive && (
                    <div className="mt-8 border-t border-slate-200 dark:border-white/10 pt-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-black text-slate-900 dark:text-white text-sm font-outfit">
                                Formular Consulta Técnica o Comercial
                            </h4>
                            <span className="text-[0.65rem] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Protección de Anonimato Activa
                            </span>
                        </div>

                        {errorMsg && (
                            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                <p>{errorMsg}</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <Textarea
                                className="w-full text-xs md:text-sm p-3.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium shadow-sm"
                                rows={3}
                                placeholder="Escribe tu consulta pública... (Tu identidad corporativa estará protegida frente a otros competidores)."
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-[0.7rem] text-slate-500 dark:text-slate-400 font-medium">
                                    Las respuestas emitidas por el comprador serán visibles para todos los postulantes.
                                </p>
                                <Button
                                    type="button"
                                    onClick={handleAskQuestion}
                                    disabled={isSubmitting || !newQuestion.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl text-xs cursor-pointer shadow-md shadow-blue-600/20"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Enviar Consulta <Send className="w-3.5 h-3.5 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
