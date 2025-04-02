export default function MyInitiatives() {
    return (
        <main>
            <section>
                <h2 class="initiatives">Мої ініціативи</h2>

                <div class="control_initiatives">
                    <button class="btn_hide">Сховати опис</button>
                    <button class="btn_filter">Фільтри</button>
                </div>

                <div class="container">
                    <div class="initiative create">
                        <h3>Створи свою ініціативу!</h3>
                        <p class="description">Створи власну ініціативу, залучи однодумців і змінюй світ разом!</p>
                        <ul></ul>
                        <button class="btn_add active">Створити!</button>
                    </div>
                </div>
            </section>
        </main>
    );
  }