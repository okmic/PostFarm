import { useNavigate } from "react-router-dom"
import { FaVk, FaTelegramPlane, FaClock, FaCheckCircle } from "react-icons/fa"
import { MdOutlineIntegrationInstructions, MdSync } from "react-icons/md"
import { FiBox } from "react-icons/fi"

export default function ServicePage() {
  const navigate = useNavigate()

  const services = [
    {
      id: "telegram",
      name: "Telegram",
      icon: FaTelegramPlane,
      color: "from-[#26A5E4] to-[#1E88E5]",
      bgColor: "bg-[#26A5E4]/10",
      borderColor: "border-[#26A5E4]/30",
      status: "active",
      description: "Интеграция с Telegram Bot API для создания ботов",
      features: [
        "Мгновенные уведомления",
        "Клавиатуры и кнопки",
        "Постинг",
        "Медиа контент",
        "Групповые чаты"
      ],
      version: "v1.0.0 (beta)",
      docs: "/docs/telegram"
    },
    {
      id: "vk",
      name: "VK",
      icon: FaVk,
      color: "from-[#4C75A3] to-[#2C5A8C]",
      bgColor: "bg-[#4C75A3]/10",
      borderColor: "border-[#4C75A3]/30",
      status: "coming-soon",
      description: "Интеграция с VK API для создания бота и управление постингом",
      features: [
        "Автоматическая синхронизация",
        "Управление сообщениями",
        "Постинг",
        "Рассылки и уведомления"
      ],
      version: "v2.1.0",
      docs: "/docs/vk"
    }
  ]

  const handleCardClick = (service: typeof services[0]) => {
    if (service.status === "active") {
      navigate(`/services/${service.id}`)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="relative max-w-7xl px-4 mx-auto sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-[#4CAF50] bg-clip-text text-transparent">
              Сервисы интеграции
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon
            const isActive = service.status === "active"

            return (
              <div
                key={service.id}
                onClick={() => handleCardClick(service)}
                className={`
                  relative group cursor-pointer transition-all duration-300
                  ${isActive ? "hover:translate-y-[-4px]" : "cursor-not-allowed"}
                `}
              >
                <div className={`
                  relative overflow-hidden rounded-2xl border 
                  ${isActive ? service.borderColor : "border-white/10"} 
                  ${isActive ? "bg-white/5" : "bg-white/3"} 
                  backdrop-blur-sm
                  transition-all duration-300
                  ${isActive ? "hover:shadow-2xl hover:shadow-[#4CAF50]/10" : "opacity-60"}
                `}>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}

                  <div className="relative p-6 lg:p-8">
                    <div className="absolute top-4 right-4">
                      {isActive ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#4CAF50]/10 border border-[#4CAF50]/20">
                          <FaCheckCircle className="text-[#4CAF50] text-[10px]" />
                          <span className="text-[10px] font-medium text-[#4CAF50]">Активен</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <FaClock className="text-amber-400 text-[10px]" />
                          <span className="text-[10px] font-medium text-amber-400">В разработке</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-4 mb-6">
                      <div className={`
                        w-14 h-14 lg:w-16 lg:h-16 rounded-xl 
                        ${isActive ? service.bgColor : "bg-white/5"} 
                        flex items-center justify-center
                        ${isActive ? "shadow-lg" : ""}
                        transition-all duration-300
                        ${isActive ? "group-hover:scale-105" : ""}
                      `}>
                        <Icon className={`
                          text-2xl lg:text-3xl 
                          ${isActive ? `text-[#4CAF50]` : "text-white/30"}
                        `} />
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">
                          {service.name}
                        </h2>
                        <p className="text-white/40 text-xs lg:text-sm">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xs font-semibold text-white/60 mb-3 flex items-center gap-2">
                        <MdOutlineIntegrationInstructions className="text-[#4CAF50]" />
                        Основные возможности
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-white/40">
                            <MdSync className="text-[#4CAF50] text-[10px]" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/20 flex items-center justify-center">
                <FiBox className="text-[#4CAF50] text-lg" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Нужна помощь с интеграцией?</h3>
                <p className="text-xs text-white/40">Cвяжитесь с поддержкой</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-xl bg-[#4CAF50]/20 border border-[#4CAF50]/30 text-[#4CAF50] text-xs font-medium hover:bg-[#4CAF50]/30 transition-all">
                Связаться с поддержкой
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}