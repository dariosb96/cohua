'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Account {
  id: string
  name: string
  balance: string | number
  exchange?: string
  isActive: boolean
  createdAt: string
  _count?: {
    trades: number
  }
}

export default function AccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    exchange: 'BINANCE',
    apiKey: '',
    apiSecret: ''
  })

  // Cargar cuentas
  useEffect(() => {
    fetchAccounts()
  }, [])

  async function fetchAccounts() {
    try {
      setLoading(true)
      const res = await fetch('/api/accounts')
      
      if (!res.ok) {
        throw new Error('Error al cargar cuentas')
      }
      
      const data = await res.json()
      setAccounts(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching accounts:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault()
    
    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre es requerido')
      return
    }

    if (!formData.balance || Number(formData.balance) <= 0) {
      setError('Balance inválido')
      return
    }

    try {
      setFormLoading(true)
      setError(null)

      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          balance: Number(formData.balance),
          exchange: formData.exchange,
          apiKey: formData.apiKey || undefined,
          apiSecret: formData.apiSecret || undefined
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al crear cuenta')
      }

      const newAccount = await res.json()
      setAccounts([newAccount, ...accounts])
      
      // Reset form
      setFormData({
        name: '',
        balance: '',
        exchange: 'BINANCE',
        apiKey: '',
        apiSecret: ''
      })
      setShowForm(false)
    } catch (err: any) {
      setError(err.message)
      console.error('Error creating account:', err)
    } finally {
      setFormLoading(false)
    }
  }

  const totalBalance = accounts.reduce(
    (acc, account) => acc + parseFloat(account.balance.toString()),
    0
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cuentas de Trading</h1>
            <p className="text-gray-600 mt-1">Gestiona tus cuentas de trading</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancelar' : '+ Nueva Cuenta'}
          </button>
        </div>

        {/* Total Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl shadow-lg mb-8">
          <p className="text-blue-100 mb-2">Balance Total</p>
          <h2 className="text-4xl font-bold">
            ${totalBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </h2>
          <p className="text-blue-100 mt-3 text-sm">{accounts.length} cuenta{accounts.length !== 1 ? 's' : ''} activa{accounts.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">Crear Nueva Cuenta</h3>
            
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Cuenta
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Binance Trading"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Balance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Balance Inicial (USDT)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    placeholder="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Exchange */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exchange
                  </label>
                  <select
                    value={formData.exchange}
                    onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="BINANCE">Binance</option>
                    <option value="BYBIT">Bybit</option>
                    <option value="OKX">OKX</option>
                    <option value="BITGET">Bitget</option>
                    <option value="KUCOIN">KuCoin</option>
                    <option value="MEXC">MEXC</option>
                  </select>
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key (Opcional)
                  </label>
                  <input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Tu API Key"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* API Secret */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Secret (Opcional)
                  </label>
                  <input
                    type="password"
                    value={formData.apiSecret}
                    onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                    placeholder="Tu API Secret"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
              >
                {formLoading ? 'Creando...' : 'Crear Cuenta'}
              </button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Accounts Grid */}
        {!loading && accounts.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No tienes cuentas aún</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Crea tu primera cuenta
            </button>
          </div>
        )}

        {!loading && accounts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <Link
                key={account.id}
                href={`/dashboard/accounts/${account.id}`}
              >
                <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer h-full p-6">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {account.exchange || 'Sin exchange'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      account.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {account.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>

                  {/* Balance */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-1">Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${parseFloat(account.balance.toString()).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-500 pt-4 border-t">
                    <span>
                      {account._count?.trades || 0} trade{account._count?.trades !== 1 ? 's' : ''}
                    </span>
                    <span>
                      {new Date(account.createdAt).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}