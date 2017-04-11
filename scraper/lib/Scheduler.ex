defmodule Scraper.Scheduler do
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, %{})
  end

  defp work_and_wait do 
    Scraper.fetch_and_store
    schedule_work()
  end

  def init(state) do
    work_and_wait
    {:ok, state}
  end

  def handle_info(:work, state) do
    work_and_wait
    {:noreply, state}
  end

  defp schedule_work() do
    Process.send_after(self(), :work, 5000) # in 5 seconds
  end
end
